// backend/src/controllers/userController.ts

import { Request, Response } from 'express';
import User from '../models/User';
import Address from '../models/Address';
import { Op } from 'sequelize';

// Add User Controller
export const addUser = async (req: Request, res: Response): Promise<void> => {
  // Manual validation
  const errors: any[] = [];
  const {
    firstName,
    lastName,
    email,
    companyAddress,
    companyCity,
    companyState,
    companyZip,
    homeAddress,
    homeCity,
    homeState,
    homeZip,
  } = req.body;

  // Validate required fields
  if (!firstName) errors.push({ msg: 'First name is required' });
  if (!lastName) errors.push({ msg: 'Last name is required' });
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push({ msg: 'Valid email is required' });
  if (!companyAddress) errors.push({ msg: 'Company address is required' });
  if (!companyCity) errors.push({ msg: 'Company city is required' });
  if (!companyState) errors.push({ msg: 'Company state is required' });
  if (!companyZip || !/^\d{6}$/.test(companyZip)) errors.push({ msg: 'Company zip must be 6 digits' });
  if (!homeAddress) errors.push({ msg: 'Home address is required' });
  if (!homeCity) errors.push({ msg: 'Home city is required' });
  if (!homeState) errors.push({ msg: 'Home state is required' });
  if (!homeZip || !/^\d{6}$/.test(homeZip)) errors.push({ msg: 'Home zip must be 6 digits' });

  // Validate file uploads
  if (!req.files || !('profilePhoto' in req.files) || !('appointmentLetter' in req.files)) {
    errors.push({ msg: 'Profile photo and appointment letter are required' });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ errors: [{ msg: 'Email already exists' }] });
      return; // Ensure return is inside the if block
    }

    const profilePhoto = (req.files as any).profilePhoto[0].filename;
    const appointmentLetter = (req.files as any).appointmentLetter[0].filename;

    // Create User
    const user = await User.create({
      firstName,
      lastName,
      email,
      profilePhoto,
      appointmentLetter,
    });

    // Create Address
    await Address.create({
      userId: user.id, // user.id is a number
      companyAddress,
      companyCity,
      companyState,
      companyZip,
      homeAddress,
      homeCity,
      homeState,
      homeZip,
    });

    res.status(201).json({ userId: user.id });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
    return;
  }
};

// Get User Controller
export const getUser = async (req: Request, res: Response): Promise<void> => {
  // Convert userId from string to number
  const userId = parseInt(req.params.id, 10);
  console.log("get by id")
  if (isNaN(userId)) {
    res.status(400).json({ msg: 'Invalid user ID' });
    return;
  }

  try {
    const user = await User.findByPk(userId, {
      include: [{ model: Address, as: 'address' }],
    });

    if (!user) {
      res.status(404).json({ msg: 'User not found' });
      return;
    }

    res.json(user);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
    return;
  }
};


export const getAllUser = async (req: Request, res: Response): Promise<void> => {
  // Convert userId from string to number
  const users = await User.findAll();
  console.log(users)
  res.json(users)

}

// Update User Controller
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  // Convert userId from string to number
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    res.status(400).json({ errors: [{ msg: 'Invalid user ID' }] });
    return;
  }

  // Manual validation
  const errors: any[] = [];
  const {
    firstName,
    lastName,
    email,
    companyAddress,
    companyCity,
    companyState,
    companyZip,
    homeAddress,
    homeCity,
    homeState,
    homeZip,
  } = req.body;

  // Validate required fields
  if (!firstName) errors.push({ msg: 'First name is required' });
  if (!lastName) errors.push({ msg: 'Last name is required' });
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push({ msg: 'Valid email is required' });
  if (!companyAddress) errors.push({ msg: 'Company address is required' });
  if (!companyCity) errors.push({ msg: 'Company city is required' });
  if (!companyState) errors.push({ msg: 'Company state is required' });
  if (!companyZip || !/^\d{6}$/.test(companyZip)) errors.push({ msg: 'Company zip must be 6 digits' });
  if (!homeAddress) errors.push({ msg: 'Home address is required' });
  if (!homeCity) errors.push({ msg: 'Home city is required' });
  if (!homeState) errors.push({ msg: 'Home state is required' });
  if (!homeZip || !/^\d{6}$/.test(homeZip)) errors.push({ msg: 'Home zip must be 6 digits' });

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  try {
    const user = await User.findByPk(userId, {
      include: [{ model: Address, as: 'address' }],
    });
    if (!user) {
      res.status(404).json({ errors: [{ msg: 'User not found' }] });
      return;
    }

    // Check if email is being updated to an existing email
    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email, id: { [Op.ne]: userId } } });
      if (existingUser) {
        res.status(400).json({ errors: [{ msg: 'Email already exists' }] });
        return;
      }
    }

    // Update user fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    if ((req.files as any).profilePhoto) {
      user.profilePhoto = (req.files as any).profilePhoto[0].filename;
    }

    if ((req.files as any).appointmentLetter) {
      user.appointmentLetter = (req.files as any).appointmentLetter[0].filename;
    }

    await user.save();

    // Update Address
    const address = await Address.findOne({ where: { userId } });
    if (address) {
      address.companyAddress = companyAddress;
      address.companyCity = companyCity;
      address.companyState = companyState;
      address.companyZip = companyZip;
      address.homeAddress = homeAddress;
      address.homeCity = homeCity;
      address.homeState = homeState;
      address.homeZip = homeZip;
      await address.save();
    } else {
      // If Address doesn't exist, create it
      await Address.create({
        userId,
        companyAddress,
        companyCity,
        companyState,
        companyZip,
        homeAddress,
        homeCity,
        homeState,
        homeZip,
      });
    }

    res.json({ msg: 'User updated successfully' });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
    return;
  }
};
